import React from "react";
import { View } from "react-native";

import { SignupOptionCard } from "./auth/SignupOptionCard";

interface SignupOptionsListProps {
  options: string[];
  selectedOption: string | null;
  onSelect: (value: string) => void;
}

export const SignupOptionsList: React.FC<SignupOptionsListProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <View>
      {options.map((option) => (
        <SignupOptionCard
          key={option}
          label={option}
          selected={selectedOption === option}
          onPress={() => onSelect(option)}
        />
      ))}
    </View>
  );
};
