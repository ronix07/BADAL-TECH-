import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import DevicesIcon from '@material-ui/icons/Devices';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import styled from 'styled-components'
import { useState } from 'react';
import { Modal } from '@material-ui/core';
import firebase from 'firebase';
import { db, storage } from '../firebase';
import { useEffect } from 'react';

const SidebarContainer = styled.div`
    margin-top: 10px;
`
const SidebarBtn = styled.div`
    button {
        background: transparent;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding:5px 10px;
        margin-left: 20px;
        margin-block: 1rem;
        span {
            font-size: 16px;
            margin-right: 20px;
            margin-left: 10px;
        }
    }
`

const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
        display: block;
        color:#333;
        font-size: 13px;
    }
`

const SidebarOption = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    &:hover{
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }
    svg.MuiSvgIcon-root {
        color:rgb(78, 78, 78);
        background: transparent;
    }
    span {
        margin-left: 15px;
        font-size: 13px;
        font-weight: 500;
        color:rgb(78, 78, 78);
        background: transparent;
    }
`

const ModalPopup = styled.div`
    top: 50%;
    background-color: #fff;
    width: 500px;
    margin: 0px auto;
    position: relative;
    transform: translateY(-50%);
    padding: 10px;
    border-radius: 10px;
`

const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`

const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
        background: darkmagenta;
        padding: 10px 20px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 16px;
        border: 0;
        outline: 0;
        border-radius: 5px;
        cursor: pointer;
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`

const UploadingPara = styled.p`
    background: green;
    color: #fff;
    margin: 20px;
    text-align: center;
    padding: 10px;
    letter-spacing: 1px;
`
const Sidebar = ({setCurrent}) => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [usedStorage, setUsedStorage] = useState(0);
    // const [current, setCurrent] = useState('home')

    const handleFile = e => {
        if (e.target.files[0]) setFile(e.target.files[0])
    }

    useEffect(() => {
        const fetchExistingStorageData = async () => {
            // Fetch the list of existing files from Firebase
            const filesSnapshot = await db.collection("myfiles").get();

            // Calculate the total used storage size
            let totalUsedSizeGB = 0;
            filesSnapshot.forEach((doc) => {
                const fileData = doc.data();
                if (fileData.size) {
                    totalUsedSizeGB += fileData.size / (1024 * 1024); // Convert to MB
                }
            });

            // Update the used storage state
            setUsedStorage(totalUsedSizeGB);
        };

        fetchExistingStorageData();
    }, []);


    const handleUpload = e => {
        e.preventDefault();
        setUploading(true);
        storage.ref(`files/${file.name}`).put(file).then(snapshot => {
            console.log(snapshot)
            storage.ref("files").child(file.name).getDownloadURL().then(url => {
                db.collection("myfiles").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    filename: file.name,
                    fileURL: url,
                    size: snapshot._delegate.bytesTransferred,
                    isActive: true
                })
                setUploading(false);
                setFile(null);
                setOpen(false)
            })
        })
    }

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalPopup>
                    <form>
                        <ModalHeading>
                            <h3>Select file you want to upload</h3>
                        </ModalHeading>
                        <ModalBody>
                            {uploading ? <UploadingPara>Uploading...</UploadingPara> :
                                (
                                    <>
                                        <input type="file" className='modal__file' onChange={handleFile} />
                                        <input type="submit" className="modal__submit" onClick={handleUpload} />
                                    </>
                                )
                            }
                        </ModalBody>
                    </form>
                </ModalPopup>
            </Modal>
            <SidebarContainer>
                <SidebarBtn>
                    <button style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{width: "1.4rem"}} fill='white'><path d="M17 7C13.5705 7 10.6449 9.15804 9.50734 12.1903L11.3805 12.8927C12.2337 10.6185 14.4278 9 17 9C17.6983 9 18.3687 9.11928 18.992 9.33857C21.3265 10.16 23 12.3846 23 15C23 18.3137 20.3137 21 17 21H7C3.68629 21 1 18.3137 1 15C1 12.3846 2.67346 10.16 5.00804 9.33857C5.0027 9.22639 5 9.11351 5 9C5 5.13401 8.13401 2 12 2C15.242 2 17.9693 4.20399 18.7652 7.19539C18.1973 7.0675 17.6065 7 17 7Z"></path></svg>
                        <span>Upload</span>
                    </button>
                </SidebarBtn>
                <SidebarOptions>
                    <SidebarOption onClick={() => setCurrent('home')}>
                        <MobileScreenShareIcon /><span>Explore Badal</span>
                    </SidebarOption>
                    <SidebarOption onClick={() => setCurrent('trash')}>
                        <DeleteOutlineOutlinedIcon /><span>Trash</span>
                    </SidebarOption>
                </SidebarOptions>
                <hr />
                <SidebarOptions>
                    <SidebarOption>
                        <CloudQueueIcon />
                        <span>Storage</span>
                    </SidebarOption>
                    <div className="progress_bar">
                        <progress size="tiny" value={(usedStorage / 2048) * 100} max="100" />

                        <span>{usedStorage.toFixed(2)} MB of 2 GB used</span>
                    </div>
                </SidebarOptions>
            </SidebarContainer>
        </>
    )
}

export default Sidebar