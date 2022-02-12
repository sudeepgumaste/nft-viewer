import { useState } from "react";
import styles from "./_.module.css";

import { ethers } from "ethers";

import { abi } from "../../utils/erc721";

type NFTData = {
  tokenUri: string;
  owner: string;
};

const fetchNFT = async (
  contractAddress: string,
  tokenId: string
): Promise<NFTData> => {
  const provider = new ethers.providers.JsonRpcProvider(
    import.meta.env.VITE_RPC_URI as string
  );
  const contract = new ethers.Contract(contractAddress, abi, provider);
  /* call tokenUri and owner of */
  const tokenUri = await contract.tokenURI(tokenId);
  console.log(tokenUri);
  const owner = await contract.ownerOf(tokenId);
  console.log(owner);

  return { tokenUri, owner };
};

const getNFTImage = async (tokenURI: string): Promise<string> => {
  const hash = tokenURI.split("//")[1];
  const res = await fetch(`https://ipfs.infura.io/ipfs/${hash}`);
  const blob = await res.json();

  const imageHash = blob.image.split("//")[1];

  return `https://ipfs.infura.io/ipfs/${imageHash}`;
};

const Form = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  const [image, setImage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { tokenUri } = await fetchNFT(contractAddress, tokenId);
    const _image = await getNFTImage(tokenUri);
    setImage(_image);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className={styles.input}
          placeholder="Contract Address"
        />
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className={styles.input}
          placeholder="Token ID"
        />
        <button className={styles.button}>Fetch</button>
        {image && <img src={image} className={styles.image} />}
      </form>
    </div>
  );
};

export default Form;
