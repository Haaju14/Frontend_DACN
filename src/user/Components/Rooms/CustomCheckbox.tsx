// CustomCheckbox.tsx
import React from 'react';
import '../../../../public/user/css/CustomeCheckbox.css'

const CustomCheckbox: React.FC<{ checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; label: string; }> = ({ checked, onChange, label }) => {
    return (
        <label className="custom-checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{ display: "none" }} // Ẩn checkbox mặc định
            />
            <span className={`checkmark ${checked ? 'checked' : ''}`}></span>
            {label}
        </label>
    );
};

export default CustomCheckbox;
