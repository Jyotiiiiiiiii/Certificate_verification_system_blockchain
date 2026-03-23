import { ethers } from "ethers";
import CertificateRegistryABI from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/contractConfig";

export interface CertificateData {
  certificateId: string;
  recipientName: string;
  courseName: string;
  issuer: string;
  issueDate: bigint;
  certificateHash: string;
  isValid: boolean;
}

/**
 * Returns a read-only contract instance (no signer needed).
 */
export function getReadContract(provider: ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryABI, provider);
}

/**
 * Returns a write-capable contract instance (signer required).
 */
export function getWriteContract(signer: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryABI, signer);
}

/**
 * Issue a certificate on-chain.
 */
export async function issueCertificateOnChain(
  signer: ethers.Signer,
  data: {
    certificateId: string;
    recipientName: string;
    courseName: string;
    issuer: string;
    certificateHash: string;
  }
): Promise<ethers.TransactionReceipt> {
  const contract = getWriteContract(signer);
  const tx = await contract.issueCertificate(
    data.certificateId,
    data.recipientName,
    data.courseName,
    data.issuer,
    data.certificateHash
  );
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Transaction failed — no receipt returned.");
  return receipt;
}

/**
 * Verify a certificate by ID.
 * Returns null if not found.
 */
export async function verifyCertificateOnChain(
  provider: ethers.Provider,
  certificateId: string
): Promise<CertificateData | null> {
  const contract = getReadContract(provider);
  try {
    const exists = await contract.certificateExists(certificateId);
    if (!exists) return null;
    const cert = await contract.verifyCertificate(certificateId);
    return {
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      courseName: cert.courseName,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      certificateHash: cert.certificateHash,
      isValid: cert.isValid,
    };
  } catch {
    return null;
  }
}

/**
 * Generate a SHA-256 hash of the certificate data for on-chain storage.
 */
export function generateCertificateHash(data: {
  certificateId: string;
  recipientName: string;
  courseName: string;
  issuer: string;
  timestamp: number;
}): string {
  const raw = JSON.stringify(data);
  // ethers v6 keccak256 on UTF-8 string
  return ethers.keccak256(ethers.toUtf8Bytes(raw));
}

/**
 * Format a Unix timestamp (bigint) to a human-readable date string.
 */
export function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
