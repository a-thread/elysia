import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";
import { TableNames } from "@shared/services/TableNames";

const findByEmail = async (email: string) => {
  return await supabaseWithAbort.request(
    `findByEmail-${email}`,
    async (client) => {
      const { data, error } = await client
        .from(TableNames.USERS)
        .select("id, display_name, profile_image")
        .eq("email", email)
        .single();

      if (error || !data?.id) {
        throw new Error("User not found.");
      }

      return {
        ...data,
        display_name: data.display_name || email,
      };
    }
  );
};

const getSession = async () => {
  return await supabaseWithAbort.request("getSession", async (client) => {
    const {
      data: { session },
      error
    } = await client.auth.getSession();
    if (error) throw new Error(`Failed to sign in: ${error.message}`);
    return session
  });
};

const signIn = async (email: string, password: string) => {
  return await supabaseWithAbort.request("signIn", async (client) => {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Failed to sign in: ${error.message}`);
  });
};

const signUp = async (email: string, password: string) => {
  return await supabaseWithAbort.request("signUp", async (client) => {
    const { error } = await client.auth.signUp({ email, password });
    if (error) throw new Error(`Failed to sign up: ${error.message}`);
  });
};

const resetPassword = async (email: string, redirectTo: string) => {
  return await supabaseWithAbort.request("resetPassword", async (client) => {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw new Error(`Failed to reset password: ${error.message}`);
  });
};

const updatePassword = async (newPassword: string) => {
  return await supabaseWithAbort.request("updatePassword", async (client) => {
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw new Error(`Failed to update password: ${error.message}`);
  });
};

const signOut = async () => {
  return await supabaseWithAbort.request("signOut", async (client) => {
    const { error } = await client.auth.signOut();
    if (error) throw new Error("Failed to sign out.");
  });
};

const getRedirectURL = () => {
  let url =
    import.meta.env.DEPLOY_URL ||
    window.location.origin + '/';
  // Ensure trailing slash
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
}

const signInWithProvider = async (
  provider: "google" | "github",
) => {
  const redirectTo = getRedirectURL();
  console.log(`OAuth redirect URL: ${redirectTo}`);
  return await supabaseWithAbort.request(`signInWith${provider}`, async (client) => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
    if (error) throw new Error(`OAuth error (${provider}): ${error.message}`);
    return data;
  });
};


export const UserService = {
  signIn,
  signInWithProvider,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  getSession,
  findByEmail,
};
