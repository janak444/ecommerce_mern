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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d441.5214005804171!2d85.34654882732673!3d27.71199977521107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19006e3c0bdd%3A0x2cae882bb1a08e5!2zU2FtYXJwYW4gUHVqYSBQYXNhbCAtIOCkuOCkruCksOCljeCkquCkoyDgpKrgpYLgpJzgpL4g4KSq4KS44KSy!5e0!3m2!1sen!2snp!4v1726914375356!5m2!1sen!2snp" width="100%"  allowfullscreen=""  referrerpolicy="no-referrer-when-downgrade" height="300px"
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
            <p>{t("📞 Contact No")}: {t("(+977) 01-5923811")}</p>
            <p>{t(" Mobile No")}: {t("9767987711")}</p>
            <p>{t("📧 EMail")}: samarpan.hindu@gmail.com</p>
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
        {t("All Rights Samarpan Pooja Samagri Pasal")} | @Powered By:
        Devsoft Vision | {t("Site Visited")}: 25k+
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
