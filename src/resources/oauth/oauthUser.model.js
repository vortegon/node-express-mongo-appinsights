import mongoose from 'mongoose';

const oauthUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const oauthUserModel = mongoose.model('oauth-user', oauthUserSchema);
export default oauthUserModel;
