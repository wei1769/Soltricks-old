import { 
  PublicKey,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram
} from "@solana/web3.js";
import { notify } from './notifications';
import { assertOwner, transferChecked } from './layout';
import { sendTransaction } from '../utils/connection';
import { TokenInstructions } from '@project-serum/serum';
import { getOwnedAccountsFilters, parseTokenAccountData } from './data';
import bs58 from 'bs58'

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

const findAssociatedTokenAddress = async (
  walletAddress,
  tokenMintAddress,
) => {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TokenInstructions.TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  )[0];
};

export const createAssociatedTokenAccountIx = async (
  fundingAddress,
  walletAddress,
  splTokenMintAddress,
) => {
  const associatedTokenAddress = await findAssociatedTokenAddress(
    walletAddress,
    splTokenMintAddress,
  );

  const systemProgramId = new PublicKey('11111111111111111111111111111111');
  const keys = [
    {
      pubkey: fundingAddress,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: systemProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TokenInstructions.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  const ix = new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
  return [ix, associatedTokenAddress];
};

const getOwnedTokenAccounts = async (connection, publicKey) => {
  let filters = getOwnedAccountsFilters(publicKey);
  let resp = await connection._rpcRequest('getProgramAccounts', [
    TOKEN_PROGRAM_ID.toBase58(),
    {
      commitment: connection.commitment,
      filters,
    },
  ]);
  if (resp.error) {
    throw new Error(
      'failed to get token accounts owned by ' +
        publicKey.toBase58() +
        ': ' +
        resp.error.message,
    );
  }
  return resp.result
    .map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data: bs58.decode(data),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    }))
    .filter(({ accountInfo }) => {
      // TODO: remove this check once mainnet is updated
      return filters.every((filter) => {
        if (filter.dataSize) {
          return accountInfo.data.length === filter.dataSize;
        } else if (filter.memcmp) {
          let filterBytes = bs58.decode(filter.memcmp.bytes);
          return accountInfo.data
            .slice(
              filter.memcmp.offset,
              filter.memcmp.offset + filterBytes.length,
            )
            .equals(filterBytes);
        }
        return false;
      });
    });
};

const createAndTransferToAccountIx = async (
  owner,
  sourcePublicKey,
  destinationPublicKey,
  amount,
  mint,
  decimals,
) => {
  const [
    createAccountIx,
    newAddress,
  ] = await createAssociatedTokenAccountIx(
    owner,
    destinationPublicKey,
    mint,
  );
  
  const assertOwnerIx = assertOwner({
    account: destinationPublicKey,
    owner: SystemProgram.programId,
  }); 

  
  let finalAmount = Math.round(parseFloat(amount) * 10 ** decimals);
  const transferIx = transferChecked({ 
    source: sourcePublicKey, 
    mint, 
    destination: newAddress, 
    amount, 
    decimals, 
    owner 
  });

  return [assertOwnerIx, createAccountIx, transferIx];
}

export const transferTokenCheck = async ({
  connection,
  owner,
  sourcePublicKey,
  destinationPublicKey,
  amount,
  mint,
  decimals,
  overrideDestinationCheck,
}) => {
  const destinationAccountInfo = await connection.getAccountInfo(
    destinationPublicKey,
  );

  if (
    !!destinationAccountInfo &&
    destinationAccountInfo.owner.equals(TOKEN_PROGRAM_ID)
  ) {
    console.log('1');
    let finalAmount = Math.round(parseFloat(amount) * 10 ** decimals);
    const transferIx =  transferChecked({ 
      source: sourcePublicKey, 
      mint, 
      destination: destinationPublicKey, 
      amount: finalAmount, 
      decimals, 
      owner 
    });

    return [transferIx];
  }

  if (
    (!destinationAccountInfo || destinationAccountInfo.lamports === 0) &&
    !overrideDestinationCheck
  ) {
    notify({
      message: "Transaction fail.",
      type: "error",
      description: `Cannot send to address with zero SOL balances`,
    });

    return [];
  }

  const destinationSplTokenAccount = (
    await getOwnedTokenAccounts(connection, destinationPublicKey)
  )
    .map(({ publicKey, accountInfo }) => {
      return { publicKey, parsed: parseTokenAccountData(accountInfo.data) };
    })
    .filter(({ parsed }) => parsed.mint.equals(mint))
    .sort((a, b) => {
      return b.parsed.amount - a.parsed.amount;
    })[0];
  if (destinationSplTokenAccount) {
    console.log('2');
    console.log(owner)
    let finalAmount = Math.round(parseFloat(amount) * 10 ** decimals);
    console.log(finalAmount);
    const transferIx =  transferChecked({ 
      source: sourcePublicKey, 
      mint, 
      destination:  destinationSplTokenAccount.publicKey, 
      amount: finalAmount, 
      decimals, 
      owner 
    });

    return [transferIx];
  }

  console.log('3');
  let finalAmount = Math.round(parseFloat(amount) * 10 ** decimals);
  console.log(owner);
  return await createAndTransferToAccountIx(
    owner,
    sourcePublicKey,
    destinationPublicKey,
    finalAmount,
    mint,
    decimals
  );

};