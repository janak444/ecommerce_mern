import React, { useEffect, useState } from 'react';
import { Box, Container, styled } from '@mui/material';
import Slide from './Slide';
import Banner from './Banner';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/userHandle';
import ProductsMenu from './customer/components/ProductsMenu';
import { NewtonsCradle } from '@uiball/loaders';
import { Link } from 'react-router-dom';
import Footer from './footer';

import { useTranslation } from "react-i18next";

const Home = () => {
  const adURL = 'https://rukminim1.flixcart.com/flap/464/708/image/1f03e99f6dc9f7a6.jpg?q=70';
 
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const { productData, responseProducts, error } = useSelector((state) => state.user);

  const [showNetworkError, setShowNetworkError] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setShowNetworkError(true);
      }, 40000);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <Container
          sx={{
            display: 'none',
            '@media (max-width: 600px)': {
              display: 'flex',
            },
          }}
        >
          <ProductsMenu dropName="Categories" />
          <ProductsMenu dropName="Products" />
        </Container>

        {/* <BannerBox>
          <Banner />
        </BannerBox> */}

        {showNetworkError ? (
          <StyledContainer>
            <h1>{t('home.networkError')}</h1>
          </StyledContainer>
        ) : error ? (
          <StyledContainer>
            <h1>{t('home.waitSecond')}</h1>
            <NewtonsCradle size={70} speed={1.4} color="black" />
          </StyledContainer>
        ) : (
          <>
            {responseProducts ? (
              <>
                <StyledContainer>{t('home.productNotFound')}</StyledContainer>
                <StyledContainer>
                {t('home.becomeSeller')}
                  <Link to="/Sellerregister">{t('home.join')}</Link>
                </StyledContainer>
              </>
            ) : (
              <>
                {/* <Component> */}
                  {/* <LeftComponent> */}
                    <Slide products={productData} title={t('home.topSelection')} />
                  {/* </LeftComponent> */}
                  {/* 
                  <RightComponent>
                    <img src={adURL} alt="" style={{ width: 217 }} />
                  </RightComponent> */}
                {/* </Component> */}

                <Slide products={productData} title={t('home.dealsOfDay')} />
                <Slide products={productData} title={t('home.suggestItems')} />
                <Slide products={productData} title={t('home.discount')} />
                <Slide products={productData} title={t('home.recommended')} />
              </>
            )}
          </>
        )}
      </ContentWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageWrapper>
  );
};

export default Home;

// Styled components

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const BannerBox = styled(Box)`
  padding: 20px 10px;
  background: #f2f2f2;
`;

const Component = styled(Box)`
  display: flex;
`;

const LeftComponent = styled(Box)(({ theme }) => ({
  width: '83%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const RightComponent = styled(Box)(({ theme }) => ({
  marginTop: 10,
  background: '#ffffff',
  width: '17%',
  marginLeft: 10,
  padding: 5,
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

// Layout Wrappers
const PageWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure it takes the full height of the viewport */
`;

const ContentWrapper = styled(Box)`
  flex: 1; /* Takes up all available vertical space */
  padding-bottom: 20px; /* Prevent content from being hidden behind footer */
`;

const FooterWrapper = styled(Box)`
  background-color: #f2f2f2;
  width: 100%;
  bottom: 0;
`;
