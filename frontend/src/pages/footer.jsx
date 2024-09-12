import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Container, Box } from "@mui/material";

// Full-width footer container
const FooterContainer = styled(Box)`
  background-color: #6a0dad;
  padding: 32px 16px;
  width: 100%;
`;

// Flex container for the content
const StyledContainer = styled(Container)`
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
`;

// Map takes full width
const MapColumn = styled(Box)`
  width: 100%;
  margin-bottom: 2rem;
`;

// Container for the Address and Related Links below the map
const RightColumns = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

// Address and Links columns share space on larger screens
const AddressColumn = styled(Box)`
  width: 100%;
  color: white;
  padding-right: 10px;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const RelatedLinksColumn = styled(Box)`
  width: 100%;
  color: white;
  padding-left: 10px;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

// Footer text styling
const FooterText = styled(Box)`
  text-align: center;
  color: white;
  margin-top: 16px;
  font-size: 0.9rem;
`;

// PageWrapper ensures the footer sticks to the bottom
const PageWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
`;

// ContentWrapper takes the remaining space above the footer
const ContentWrapper = styled(Box)`
  flex: 1;
  padding-bottom: 20px;
`;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterContainer>
      <StyledContainer>
        {/* Full-width Map */}
        <MapColumn>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28261.65324460308!2d85.30148171589194!3d27.695459987052338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19927fc9e8c7%3A0xb28a07a477e8700d!2z4KSV4KS-4KSg4KSu4KS-4KSj4KWN4KSh4KWM4KSBIOCkieCkquCkpOCljeCkr-CkleCkviDgpLXgpL_gpJXgpL7gpLgg4KSq4KWN4KSw4KS-4KSn4KS_4KSV4KSw4KSj!5e0!3m2!1sen!2snp!4v1708360973392!5m2!1sen!2snp"
            width="100%"
            height="300px"
            style={{ border: "0" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </MapColumn>

        {/* Below the map: Address and Related Links */}
        <RightColumns>
          {/* Address Column */}
          <AddressColumn>
            <h2>{t("Address")}</h2>
            <p>{t("📞 Contact No")}: {t("(+977) 01-5911017")}</p>
            <p>{t("📧 EMail")}: urban.eba.development@gmail.com</p>
          </AddressColumn>

          {/* Related Links Column */}
          <RelatedLinksColumn>
            <h2>{t("Related Links")}</h2>
            <ul>
              <a href="https://moud.gov.np/" target="_blank" rel="noreferrer noopener">
                <li>{t("Ministry of Urban Development")}</li>
              </a>
              <a href="https://www.thegef.org/" target="_blank" rel="noreferrer noopener">
                <li>{t("Global Environment Facility")}</li>
              </a>
              <a href="https://www.unep.org/ecosystem-based-adaptation-nepal" target="_blank" rel="noreferrer noopener">
                <li>{t("United Nations Environment Programme")}</li>
              </a>
              <a href="https://www.kvda.gov.np/" target="_blank" rel="noreferrer noopener">
                <li>{t("Kathmandu Valley Development Authority")}</li>
              </a>
            </ul>
          </RelatedLinksColumn>
        </RightColumns>
      </StyledContainer>

      <FooterText>
        {t("Last updated on")}: 1 day ago | ©{" "}
        {t("All Rights Kathmandu Valley Development Authority - Urban EbA Project")} | @Powered By:
        Devsoft Vision | {t("Site Visited")}: 25k+
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
