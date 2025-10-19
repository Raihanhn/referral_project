import { create } from "zustand";

interface UserState {
  user: any | null;
  setUser: (user: any) => void;
  updateCredits: (amount: number) => void;
}

const useStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateCredits: (amount) =>
    set((state) => ({ user: { ...state.user, credits: state.user.credits + amount } })),
}));

export default useStore;
