import { InputBase, Box, styled } from '@mui/material';
import React from 'react';

import { useTranslation } from 'react-i18next';   
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSearchedProducts } from '../../../redux/userHandle';


const Search = () => {
    const { t } = useTranslation();

    const navigate = useNavigate()

    const dispatch = useDispatch();

    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = () => {
        dispatch(getSearchedProducts("searchProduct", searchTerm));

        if (location.pathname !== "/ProductSearch") {
            navigate("/ProductSearch");
        }
    };

    return (
        <SearchContainer>
            <InputSearchBase
                placeholder={t("navbar.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <SearchIconWrapper>
                <SearchIcon sx={{ color: "#4d1c9c" }} />
            </SearchIconWrapper>
        </SearchContainer>
    )
}

const SearchContainer = styled(Box)`
  border-radius: 2px;
  margin-left: 10px;
  width: 38%;
  background-color: #fff;
  display: flex;
`;

const SearchIconWrapper = styled(Box)`
  margin-left: auto;
  padding: 5px;
  display: flex;
  color: blue;
`;

const InputSearchBase = styled(InputBase)`
  font-size: unset;
  width: 100%;
  padding-left: 20px;
`;

export default Search;