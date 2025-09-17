/**
 * 認証エラーのハンドリングユーティリティ
 */

// 認証APIのレスポンス型定義
interface AuthApiResponse {
  data?: {
    id?: string;
    email?: string;
    name?: string;
    token?: string;
    created_at?: string;
    message?: string;
  };
  message?: string;
  error?: string;
}

// バックエンドから返される可能性のあるエラーメッセージと日本語の対応
const errorMessages: Record<string, string> = {
  // ログイン関連
  "invalid email or password": "メールアドレスまたはパスワードが正しくありません",
  "Invalid email or password": "メールアドレスまたはパスワードが正しくありません",
  "failed to generate token": "ログインに失敗しました。しばらく時間をおいて再度お試しください",
  
  // ユーザー登録関連
  "user with this email already exists": "このメールアドレスは既に登録されています",
  "User with this email already exists": "このメールアドレスは既に登録されています",
  "Email, password, and name are required": "メールアドレス、パスワード、名前をすべて入力してください",
  "Password must be at least 6 characters": "パスワードは6文字以上で入力してください",
  
  // パスワードリセット関連
  "無効なトークンです": "パスワードリセットリンクが無効です。再度申請してください",
  "トークンの有効期限が切れています": "パスワードリセットリンクの有効期限が切れています。再度申請してください",
  "パスワードリセットに失敗しました": "パスワードの変更に失敗しました。再度お試しください",
  "パスワードリセット申請に失敗しました": "パスワードリセットの申請に失敗しました。再度お試しください",
  
  // 汎用エラー
  "Internal server error": "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください",
  "Bad Request": "入力内容に問題があります。正しく入力してください",
  "Unauthorized": "認証に失敗しました",
  
  // バリデーションエラー（Ginから返される可能性）
  "Key: 'CreateUserRequest.Email' Error:Field validation for 'Email' failed on the 'required' tag": "メールアドレスを入力してください",
  "Key: 'CreateUserRequest.Password' Error:Field validation for 'Password' failed on the 'required' tag": "パスワードを入力してください",
  "Key: 'CreateUserRequest.Name' Error:Field validation for 'Name' failed on the 'required' tag": "名前を入力してください",
  "Key: 'CreateUserRequest.Email' Error:Field validation for 'Email' failed on the 'email' tag": "正しいメールアドレスを入力してください",
  "Key: 'CreateUserRequest.Password' Error:Field validation for 'Password' failed on the 'min' tag": "パスワードは6文字以上で入力してください",
  "Key: 'LoginUserRequest.Email' Error:Field validation for 'Email' failed on the 'required' tag": "メールアドレスを入力してください",
  "Key: 'LoginUserRequest.Password' Error:Field validation for 'Password' failed on the 'required' tag": "パスワードを入力してください",
  "Key: 'LoginUserRequest.Email' Error:Field validation for 'Email' failed on the 'email' tag": "正しいメールアドレスを入力してください",
};

// HTTPステータスコードに基づくデフォルトエラーメッセージ
const statusErrorMessages: Record<number, string> = {
  400: "入力内容に問題があります。正しく入力してください",
  401: "メールアドレスまたはパスワードが正しくありません",
  403: "アクセス権限がありません",
  404: "ページが見つかりません",
  409: "既に登録されているデータです",
  422: "入力内容を確認してください",
  429: "リクエストが多すぎます。しばらく時間をおいて再度お試しください",
  500: "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください",
  502: "サーバーに接続できません。しばらく時間をおいて再度お試しください",
  503: "サービスが一時的に利用できません。しばらく時間をおいて再度お試しください",
  504: "タイムアウトが発生しました。しばらく時間をおいて再度お試しください",
};

/**
 * エラーメッセージをユーザーフレンドリーな日本語に変換
 */
export function translateErrorMessage(error: unknown, statusCode?: number): string {
  let errorMessage = "";
  
  // エラーオブジェクトからメッセージを抽出
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  // 空のエラーメッセージの場合はステータスコードベースのメッセージを使用
  if (!errorMessage && statusCode) {
    return statusErrorMessages[statusCode] || "予期しないエラーが発生しました";
  }

  // 完全一致でエラーメッセージを検索
  if (errorMessages[errorMessage]) {
    return errorMessages[errorMessage];
  }

  // 部分一致でエラーメッセージを検索
  for (const [key, value] of Object.entries(errorMessages)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // バリデーションエラーの場合（ginのバリデーションエラー形式）
  if (errorMessage.includes("Field validation")) {
    // Email関連
    if (errorMessage.includes("'Email'") && errorMessage.includes("'required'")) {
      return "メールアドレスを入力してください";
    }
    if (errorMessage.includes("'Email'") && errorMessage.includes("'email'")) {
      return "正しいメールアドレスを入力してください";
    }
    
    // Password関連
    if (errorMessage.includes("'Password'") && errorMessage.includes("'required'")) {
      return "パスワードを入力してください";
    }
    if (errorMessage.includes("'Password'") && errorMessage.includes("'min'")) {
      return "パスワードは6文字以上で入力してください";
    }
    
    // Name関連
    if (errorMessage.includes("'Name'") && errorMessage.includes("'required'")) {
      return "名前を入力してください";
    }
    
    // Token関連
    if (errorMessage.includes("'Token'") && errorMessage.includes("'required'")) {
      return "リセットトークンが必要です";
    }
    
    // NewPassword関連
    if (errorMessage.includes("'NewPassword'") && errorMessage.includes("'required'")) {
      return "新しいパスワードを入力してください";
    }
    if (errorMessage.includes("'NewPassword'") && errorMessage.includes("'min'")) {
      return "パスワードは8文字以上で入力してください";
    }
    
    return "入力内容を確認してください";
  }

  // ステータスコードベースのメッセージを使用
  if (statusCode && statusErrorMessages[statusCode]) {
    return statusErrorMessages[statusCode];
  }

  // デフォルトメッセージ
  return errorMessage || "予期しないエラーが発生しました";
}

/**
 * APIレスポンスエラーを処理
 */
export async function handleApiError(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    const errorMessage = errorData.error || errorData.message || "";
    return translateErrorMessage(errorMessage, response.status);
  } catch {
    // JSONパースに失敗した場合はステータスコードベースのメッセージを返す
    return translateErrorMessage("", response.status);
  }
}

/**
 * 認証API呼び出し用のヘルパー関数
 */
export async function callAuthApi(url: string, data: object): Promise<{ success: boolean; data?: AuthApiResponse; error?: string }> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      return { success: false, error: errorMessage };
    }

    const responseData: AuthApiResponse = await response.json();
    return { success: true, data: responseData };
  } catch (error) {
    const errorMessage = translateErrorMessage(error);
    return { success: false, error: errorMessage };
  }
}
