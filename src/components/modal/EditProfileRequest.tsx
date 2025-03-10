import React from "react";
import { SubmitButton } from "../buttons/CustomButtons";

interface EditMyProfileInterface {
  onClose: () => void;
}

const EditProfileRequest: React.FC<EditMyProfileInterface> = ({ onClose }) => {
  const handleSubmit = () => {};

  return (
    <div className="edit-profile-request-modal">
      <form onSubmit={handleSubmit} className="user-form s-bar">
        <div className="form-item ">
          <input
            type="text"
            name="name"
            placeholder="Name"
            // value={formData.name}
            // onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <input
            type="email"
            name="email"
            placeholder="Email"
            // value={formData.email}
            // onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            // value={formData.bankName}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="ibanNumber"
            placeholder="IBAN Number"
            // value={formData.ibanNumber}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="accountHolder"
            placeholder="Account Holder"
            // value={formData.accountHolder}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            // value={formData.accountNumber}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="whatsApp"
            placeholder="WhatsApp"
            // value={formData.whatsApp}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            // value={formData.phoneNumber}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="emergencyContact"
            placeholder="Emergency Contact"
            // value={formData.emergencyContact}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <input
            type="text"
            name="address"
            placeholder="Address"
            // value={formData.address}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <SubmitButton label="Submit" />
        </div>
      </form>
    </div>
  );
};

export default EditProfileRequest;
