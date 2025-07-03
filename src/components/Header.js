import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import AppsIcon from '@material-ui/icons/Apps';
import { Avatar } from '@material-ui/core';

const HeaderContainer = styled.div`
    display: grid;
    grid-template-columns: 300px auto 200px;
    align-items: center;
    padding: 5px 20px;
    height: 60px;
    margin-top: 1rem;
`
const HeaderLogo = styled.div`
    display: flex;
    align-items: center;
    img {
        width: 40px;
    }
    span{
        font-size: 22px;
        margin-left: 10px;
        color: gray;
    }
`

const HeaderSearch = styled.div`
    display: flex;
    align-items: center;
    width: 700px;
    background-color: whitesmoke;
    padding: 12px;
    border-radius: 10px;
    input{
        background-color: transparent;
        border: 0;
        outline: 0;
        flex: 1;
    }
`

const HeaderIcons = styled.div`
    display: flex;
    align-items: center;
    span {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    svg.MuiSvgIcon-root{
        margin: 0px 10px;
    }
`

const Header = ({ photoURL }) => {
    console.log(photoURL)
    return (
        <HeaderContainer style={{marginBottom: "1rem"}}>
            <HeaderLogo>
                <img src={process.env.PUBLIC_URL + "logo.png"} alt="Badal" />
                <span>Badal Tech</span>
            </HeaderLogo>
            <HeaderSearch>
                <SearchIcon style={{background: 'transparent', fill: '#252525', marginRight: "1rem"}} />
                <input type="text" placeholder='Search Badal ...' />
                <FormatAlignCenterIcon style={{background: 'transparent', fill: '#252525'}}  />
            </HeaderSearch>
            <HeaderIcons>
                <span>
                    <HelpOutlineIcon />
                    <SettingsIcon />
                </span>
                <span>
                    <AppsIcon />
                    <Avatar src={photoURL} />
                </span>
            </HeaderIcons>
        </HeaderContainer>
    )
}

export default Header