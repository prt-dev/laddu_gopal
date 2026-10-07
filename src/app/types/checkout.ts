import { User } from "./auth";
import { FetchedUserDetails } from "./user";

export interface BillingFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  notes: string;
}

export interface CheckoutContextType {
  formData: BillingFormData;
  updateFormField: (name: keyof BillingFormData | string, value: string) => void;
  hasSavedData: boolean;
  isFormSaved: boolean;
  setIsFormSaved: (saved: boolean) => void;
  isSaving: boolean;
  saveMessage: { type: "success" | "error"; text: string } | null;
  setSaveMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
  isLoadingUser: boolean;
  missingMandatoryFields: string[];
  handleSaveDetails: (tokenOverride?: string) => Promise<User | null>;
  handleClearSavedDetails: () => void;
  focusFirstMissingField: (inputName?: string | keyof BillingFormData) => void;
}
