import CryptoJS from "crypto-js";

export const decrypt = ({
  data,
  secretKey = process.env.CRYPTO_KEY,
}) => {
  return CryptoJS.AES.decrypt(data, secretKey).toString(
    CryptoJS.enc.Utf8
  );
};
