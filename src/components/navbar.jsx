// f94d1f
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import BBIP from "../assets/BBIP.png";
import SOL from "../assets/sol.webp";
import CHECK from "../assets/check.png";
import PROFILE from "../assets/profile.png";

export default function Navbar({ redirect }) {
    if (redirect == undefined) redirect = false;
    const [flag, setFlag] = useState(false);
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cogniID, setCogniID] = useState("");
    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    window.solana.on("connect", () => {
        console.log("connected");
        setConnected(true);
        setAddress(window.solana.publicKey.toBase58());
        localStorage.setItem("solanaAddress", window.solana.publicKey.toBase58());
        localStorage.setItem("solanaConnected", true);
    });

    window.solana.on("disconnect", () => {
        console.log("disconnected");
        setConnected(false);
        setAddress("");
        localStorage.removeItem("solanaAddress");
        localStorage.setItem("solanaConnected", false);
    });

    if (localStorage.getItem("solanaConnected") === "true" && !connected) {
        setConnected(true);
        setAddress(localStorage.getItem("solanaAddress"));
    }

    useEffect(() => {
        console.log("connected: ", connected)
        if (connected) {
            toast.success("Connected to Solana");
        } else {
            toast.warning("Disconnected from Solana");
            navigate("/");
        }
    }, [connected]);

    function connectWallet() {
        console.log("clicked")
        if (window.solana) {
            if (connected) {
                // alert with yes no buttons
                if (window.confirm("Are you sure you want to disconnect?")) {
                    window.solana.disconnect();
                    setConnected(false);
                    setAddress("");
                    localStorage.removeItem("solanaAddress");
                    localStorage.setItem("solanaConnected", false);
                }
            } else {
                window.solana.connect().then(e => console.log(e)).catch(e => console.log(e));
            }

        } else {
            alert("Please install Phanton wallet extension to continue");
        }
    }

    function openProfile() {
        navigate("/profile");
    }


    return <div className="w-full bg-transparent p-2 flex content-between justify-between">
        <img src={BBIP} width={150} style={{ aspectRatio: 1 }} onClick={() => navigate("/")} />
        <ToastContainer position="top-right" theme="dark" />
        <div className="flex pr-10">
            <button className="rounded-full truncate ... h-fit w-[160px] px-3 py-1 bg-[#f94d1f] text-black font-bold m-6 flex justify-center"
                onClick={connectWallet}>
                {connected ? <>{address.substring(0, 4) + "..." + address.substring(address.length - 4, address.length)}
                    <img img src={CHECK} className="ml-1 fill-white" width={23}></img></>
                    :
                    <><img src={SOL} width={25} ></img> Connect</>
                }
            </button>
            {connected && <button className="rounded-full h-fit w-fit bg-[#f94d1f] text-black font-bold my-6 flex justify-center" onClick={openProfile}><img src={PROFILE} width={35}></img></button>}
        </div>
    </div >
}