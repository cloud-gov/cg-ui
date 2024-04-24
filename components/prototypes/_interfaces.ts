export interface CFUserInterface {
  email: string;
  spaces: Array<CFUSerSpace>;
}

export interface CFUSerSpace {
  spaceName: string;
  roleName: string;
}
