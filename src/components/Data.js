import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListIcon from '@material-ui/icons/List';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Delete, Edit } from '@material-ui/icons';
import Trash from './Trash';

const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`

const DataHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid lightgray;
    height: 40px;
    .headerLeft {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .headerLeft p {
        margin-bottom: 0;
    }
    .headerRight svg {
        margin:0px 10px;
    }
`

const DataGrid = styled.div`
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`

const DataFile = styled.div`
    text-align: center;
    border: 1px solid rgb(204 204 204 / 46%);
    margin: 10px;
    min-width: 200px;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    svg {
        font-size: 60px;
        color:gray
    }
    p {
        border-top: 1px solid #ccc;
        margin-top: 5px;
        font-size: 12px;
        background: whitesmoke;
        padding: 10px 0px;
    }
`

const DataListRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    p {
        display: flex;
        align-items: center;
        font-size: 13px;
        b {
            display: flex;
            align-items: center;
        }
        svg {
            font-size: 22px;
            margin:10px
        }
    }
`

const Data = ({current}) => {
    const [files, setFiles] = useState([]);
    // const [current, setCurrent] = useState('home') 

    useEffect(() => {
        db.collection("myfiles")
            .where("isActive", "==", true)
            .onSnapshot(snapshot => {
                setFiles(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))
            })
    }, [])

    const deleteFile = (fileId) => {
        // Reference to the document you want to update
        const fileRef = db.collection('myfiles').doc(fileId);

        // Update the isActive field to false
        return fileRef.update({
            isActive: false
        })
            .then(() => {
                alert('File marked as inactive.');
            })
            .catch((error) => {
                console.error('Error marking file as inactive:', error);
            });
    }

    const changeBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <>
        {current === 'home' ? (
            <DataContainer>
                <DataHeader>
                    <div className="headerLeft">
                        <p>My Files</p>
                        <ArrowDropDownIcon />
                    </div>
                    <div className="headerRight">
                        <ListIcon />
                        <InfoOutlinedIcon />
                    </div>
                </DataHeader>
                <div>
                    <DataGrid>
                        {files.map(file => (
                            <DataFile key={file.id} style={{ cursor: "pointer" }}>
                                <InsertDriveFileIcon />
                                <p style={{ background: 'transparent', marginInline: '1rem', marginTop: '1rem' }}>{file.data.filename}</p>
                            </DataFile>
                        ))}
                    </DataGrid>
                    <div>
                        <DataListRow>
                            <p><b>Name <ArrowDownwardIcon /></b></p>
                            <p><b>Owner</b></p>
                            <p><b>Last Modified</b></p>
                            <p><b>File Size</b></p>
                            <p><b>Actions</b></p>
                        </DataListRow>
                        {files.map(file => (
                            <DataListRow key={file.id}>
                                <a href={file.data.fileURL} target="_blank">
                                    <p><InsertDriveFileIcon /> {file.data.filename}</p>
                                </a>
                                <p>Owner</p>
                                <p>{new Date(file.data.timestamp?.seconds * 1000).toUTCString()}</p>
                                <p>{changeBytes(file.data.size)}</p>
                                <p className='d-flex justify-content-center align-items-center cursor-pointer'>
                                    <div onClick={() => deleteFile(file.id)}>
                                        <Delete className='mx-2' />
                                    </div>
                                    <Edit />
                                </p>
                            </DataListRow>
                        ))}
                    </div>
                </div>
            </DataContainer>
        ) : (
            <Trash />
        )}
        </>
    )
}

export default Data