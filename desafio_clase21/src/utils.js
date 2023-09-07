import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const PRIVATE_KEY = "CoderKeyMuySecret";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


// Function to generate random token
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}