// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import * as userApi from "@/services/user.service";
// import type { IUserProfile } from "@/types";

// /* =========================
//    Types & Interfaces
// ========================= */

// interface UserState {
//   profile: IUserProfile | null;
//   loading: boolean;
//   error: string | null;
// }

// // Define the shape of your API error
// interface ApiError {
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
// }

// const initialState: UserState = {
//   profile: null,
//   loading: false,
//   error: null,
// };

// /* =========================
//    Thunks
// ========================= */

// export const fetchUserProfile = createAsyncThunk<
//   IUserProfile, // Return type
//   void, // Argument type
//   { rejectValue: string } // Config for rejectWithValue
// >("user/fetchProfile", async (_, { rejectWithValue }) => {
//   try {
//     const response = await userApi.getMyProfile();
//     return response.data as IUserProfile;
//   } catch (e) {
//     const error = e as ApiError;
//     return rejectWithValue(
//       error.response?.data?.message || "Failed to load profile"
//     );
//   }
// });

// export const updateUserProfile = createAsyncThunk<
//   { name: string; about: string; phone: string; link: string }, // Adjust this based on your API return
//   { name: string; about: string; phone: string; link: string },
//   { rejectValue: string }
// >("user/updateProfile", async (payload, { rejectWithValue }) => {
//   try {
//     const { data } = await userApi.updateName(payload);

//     return data;
//   } catch (e) {
//     const error = e as ApiError;
//     return rejectWithValue(
//       error.response?.data?.message || "Profile update failed"
//     );
//   }
// });

// export const uploadProfileImage = createAsyncThunk<
//   string, // Returns the imageUrl string
//   File,
//   { rejectValue: string }
// >("user/uploadProfileImage", async (file, { rejectWithValue }) => {
//   try {
//     const { data } = await userApi.getUploadUrl(file.type);
//     const { uploadUrl, fileKey } = data;

//     // 2️ Upload to S3
//     const res = await fetch(uploadUrl, {
//       method: "PUT",
//       headers: {
//         "Content-Type": file.type,
//       },
//       body: file,
//     });

//     if (!res.ok) {
//       throw new Error("S3 upload failed");
//     }

//     // 3️ Save image URL in DB
//     const response = await userApi.saveProfileImage(fileKey);
//     const imageUrl = response.data.imageUrl;

//     return imageUrl;
//   } catch (e) {
//     const error = e as ApiError;
//     return rejectWithValue(
//       error.response?.data?.message || "Image upload failed"
//     );
//   }
// });

// export const changePassword = createAsyncThunk(
//   "auth/changePassword",
//   async (
//     { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await userApi.updatePassword({
//         oldPassword,
//         newPassword,
//       });
//       return response.data;
//     } catch (err) {
//       const error = err as ApiError;
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to change password"
//       );
//     }
//   }
// );
// export const sendOtpToNewEmail = createAsyncThunk(
//   "auth/sendOtpToNewEmail",
//   async ({ newEmail }: { newEmail: string }, { rejectWithValue }) => {
//     try {
//       const response = await userApi.sendOtp(newEmail);
//       return response;
//     } catch (error) {
//       const err = error as ApiError;
//       return (
//         rejectWithValue(err.response?.data?.message) || "Failed to send Otp"
//       );
//     }
//   }
// );

// // CORRECT
// export const verifyOtpAndUpdateEmail = createAsyncThunk(
//   "auth/verifyOtpAndUpdateEmail",
//   async (
//     { emailChangeOtp }: { emailChangeOtp: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await userApi.verifyAndUpdateEmail(emailChangeOtp);

//       return response.data.newEmail; // Ensure you return .data
//     } catch (error) {
//       const err = error as ApiError;
//       // Return the result of rejectWithValue directly
//       return rejectWithValue(
//         err.response?.data?.message || "Invalid OTP or expired"
//       );
//     }
//   }
// );
// /* =========================
//    Slice
// ========================= */

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     clearUserError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* -------- Fetch Profile -------- */
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.profile = action.payload; // action.payload is now typed as IUserProfile
//         state.loading = false;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Unknown error";
//       })

//       /* -------- Update Profile -------- */
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         if (state.profile) {
//           Object.assign(state.profile, action.payload);
//         }
//         state.loading = false;
//       })

//       /* -------- Upload Image -------- */
//       .addCase(uploadProfileImage.fulfilled, (state, action) => {
//         if (state.profile) {
//           state.profile.imageUrl = action.payload;
//         }
//         state.loading = false;
//       })
//       .addCase(verifyOtpAndUpdateEmail.fulfilled, (state, action) => {
//         if (state.profile) {
//           state.profile.email = action.payload;
//         }
//       });
//     // (Rejected cases follow the same pattern as fetchUserProfile)
//   },
// });

// export const { clearUserError } = userSlice.actions;
// export default userSlice.reducer;
