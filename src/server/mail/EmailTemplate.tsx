// src/templates/EmailTemplate.tsx
import React from "react";
import { Html, Head, Preview, Body, Container, Text } from "@react-email/components";

export const EmailTemplate = ({ name }: { name: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Our Service</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>Hello {name},</Text>
          <Text>Welcome to our platform! We&apos;re excited to have you.</Text>
        </Container>
      </Body>
    </Html>
  );
};
