import { useEffect, useMemo, useState } from "react";
import * as Input from "./Input";
import * as Select from "./Select";

interface CountryCode {
  code: string;
  label: string;
  icon?: string;
}

interface PhoneInputProps {
  countries: CountryCode[];
  placeholder?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (phoneNumber: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  selectPosition?: "start" | "end";
  disabled?: boolean;
}

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 10);

  if (numbers.length === 0) return "";
  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6)
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
};

const parsePhoneValue = (rawValue: string, dialCode: string) => {
  if (!rawValue) {
    return { dialCode, localNumber: "" };
  }

  const normalized = rawValue.trim();

  if (normalized.startsWith("+")) {
    const matched = normalized.match(/^\+\d+/)?.[0];
    if (matched) {
      const localPart = normalized.slice(matched.length).trim();
      return {
        dialCode: matched,
        localNumber: formatPhoneNumber(localPart),
      };
    }
  }

  return {
    dialCode,
    localNumber: formatPhoneNumber(normalized),
  };
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "(555) 000-0000",
  onChange,
  onBlur,
  id,
  name,
  value,
  selectPosition = "start",
  disabled = false,
}) => {
  const fallbackCountry = useMemo(
    () => countries[0] ?? { code: "", label: "+1" },
    [countries],
  );

  const [selectedCountry, setSelectedCountry] = useState<string>(
    fallbackCountry.code,
  );
  const [localNumber, setLocalNumber] = useState<string>("");

  const countryCodeMap = useMemo(
    () =>
      countries.reduce<Record<string, string>>((acc, item) => {
        acc[item.code] = item.label;
        return acc;
      }, {}),
    [countries],
  );

  useEffect(() => {
    if (!countries.length) return;

    const allDialCodes = countries
      .map((c) => c.label)
      .sort((a, b) => b.length - a.length);
    const incoming = value ?? "";
    const matchedDialCode =
      allDialCodes.find((dialCode) => incoming.startsWith(dialCode)) ??
      fallbackCountry.label;

    const matchedCountry =
      countries.find((country) => country.label === matchedDialCode) ??
      fallbackCountry;

    setSelectedCountry(matchedCountry.code);
    setLocalNumber(parsePhoneValue(incoming, matchedDialCode).localNumber);
  }, [value, countries, fallbackCountry]);

  const emitValue = (countryCode: string, formattedLocalNumber: string) => {
    const dialCode = countryCodeMap[countryCode] ?? fallbackCountry.label;
    const combined = `${dialCode}${formattedLocalNumber ? ` ${formattedLocalNumber}` : ""}`;
    onChange?.(combined);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    emitValue(countryCode, localNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setLocalNumber(formatted);
    emitValue(selectedCountry, formatted);
  };

  const selectElement = (
    <Select.Root
      variant="compactForInput"
      value={selectedCountry || undefined}
      onValueChange={handleCountryChange}
      disabled={disabled}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {countries.map((item) => (
          <Select.Item key={item.code} value={item.code}>
            {item.icon && (
              <Select.ItemIcon
                style={{
                  backgroundImage: `url(${item.icon})`,
                }}
              />
            )}
            {item.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );

  return (
    <Input.Root>
      {selectPosition === "start" && selectElement}
      <Input.Wrapper>
        <Input.Input
          type="tel"
          id={id}
          name={name}
          value={localNumber}
          placeholder={placeholder}
          onChange={handleNumberChange}
          onBlur={onBlur}
          maxLength={14}
          disabled={disabled}
        />
      </Input.Wrapper>
      {selectPosition === "end" && selectElement}
    </Input.Root>
  );
};

export default PhoneInput;
