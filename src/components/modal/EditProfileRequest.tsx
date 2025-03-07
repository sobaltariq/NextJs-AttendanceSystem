import React from "react";
import { SubmitButton } from "../buttons/CustomButtons";

interface EditMyProfileInterface {
  onClose: () => void;
}

const EditProfileRequest: React.FC<EditMyProfileInterface> = ({ onClose }) => {
  const handleSubmit = () => {};

  return (
    <div className="edit-profile-request-modal">
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-item">
          <label>Name</label>
          <input
            type="text"
            name="name"
            // value={formData.name}
            // onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Email</label>
          <input
            type="email"
            name="email"
            // value={formData.email}
            // onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Bank Name</label>
          <input
            type="text"
            name="bankName"
            // value={formData.bankName}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>IBAN Number</label>
          <input
            type="text"
            name="ibanNumber"
            // value={formData.ibanNumber}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Account Holder</label>
          <input
            type="text"
            name="accountHolder"
            // value={formData.accountHolder}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            // value={formData.accountNumber}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>WhatsApp</label>
          <input
            type="text"
            name="whatsApp"
            // value={formData.whatsApp}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            // value={formData.phoneNumber}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            // value={formData.emergencyContact}
            // onChange={handleChange}
          />
        </div>

        <div className="form-item">
          <label>Address</label>
          <textarea
            name="address"
            // value={formData.address}
            // onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-item">
          <SubmitButton label="Submit" />
        </div>
      </form>
    </div>
  );
};

export default EditProfileRequest;
