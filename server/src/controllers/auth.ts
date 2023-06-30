import { ErrorCode } from '../protocol/common/ErrorCode';

export const logIn = async (req, res) => {
  try {
    const {loginEmail, password, autoLogin} = req.body;
    // validate
    // if email, password matches, send jwt

    res.status(200).json({
      isLoggedIn: true,
      errorcode: ErrorCode.success
    })

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}