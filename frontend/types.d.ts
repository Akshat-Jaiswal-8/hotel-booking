type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}
