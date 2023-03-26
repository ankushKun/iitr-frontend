import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileInput, TextInput, LoadingOverlay } from "@mantine/core";
import { IconCamera, IconX } from "@tabler/icons-react";
import Navbar from "../components/navbar";
import axios from "axios";
import Webcam from "react-webcam";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QrReader from 'react-qr-scanner';

const WebcamComponent = () => <Webcam />;
const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
}

function base64toFile(base64String, filename) {
    const parts = base64String.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const data = atob(parts[1]);
    const array = new Uint8Array(data.length);

    for (let i = 0; i < data.length; i++) {
        array[i] = data.charCodeAt(i);
    }

    const blob = new Blob([array], { type: contentType });
    return new File([blob], filename, { type: contentType });
}

export default function Verification() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [addressSet, setAddressSet] = useState("");
    const [file, setFile] = useState(null);
    const [showLoader, setShowLoader] = useState(false);

    const [gotCogniID, setGotCogniID] = useState(false);
    const [cogniID, setCogniID] = useState("");

    const [picture, setPicture] = useState('');
    const webcamRef = useRef(null);
    const capture = useCallback(() => {
        const pictureSrc = webcamRef.current.getScreenshot();
        setPicture(pictureSrc);
        setFile(base64toFile(pictureSrc, "image.png"));
    })

    const navigate = useNavigate();

    if (!localStorage.getItem("solanaConnected") == "true") {
        navigate("/");
    } else {
        if (!addressSet) {
            setAddress(localStorage.getItem("solanaAddress") || "");
            setAddressSet(true);
        }
    }

    function register() {
        // post file along with json data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("cogni_id", cogniID);
        formData.append("address", address);
        formData.append("file", file);

        setShowLoader(true);
        axios.defaults.timeout = 1000 * 60;
        axios.post("http://localhost:8080/api/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
            console.log(res);
            setShowLoader(false);
            toast.success("Successfully registered! You'll get your NFT soon!");
        }).catch((err) => {
            console.log(err);
            setShowLoader(false);
            // toast.done("Successfully registered! You'll get your NFT soon!");
            toast.error("Something went wrong! Please try again later.");
        });
    }

    useEffect(() => {
        console.log(picture);
    }, [picture]);

    function handleScan(data) {
        if (data && !gotCogniID) {
            console.log(data);
            setCogniID(data.text);
            setGotCogniID(true);
        }
    }
    function handleError(err) {
        console.error(err)
    }

    return (
        <div className="w-100 bg-black h-[100%] text-white">
            <Navbar />
            <LoadingOverlay visible={showLoader} overlayBlur={2} />
            <div className="flex justify-center gap-20">
                {!gotCogniID && <QrReader
                    delay={100}
                    style={{
                        height: 240,
                        width: 320,
                    }}
                    onError={handleError}
                    onScan={handleScan}
                />}
                <ToastContainer position="top-right" theme="dark" />
            </div>
        </div>
    )
}