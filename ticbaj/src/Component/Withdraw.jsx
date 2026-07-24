import React, { useEffect, useState } from 'react'
import './Style.css'
import Header from './Header'
import BottomMenu from './Bottommenu'
import { useNavigate } from 'react-router-dom'
import { db, auth } from './firebase'
import { doc, getDoc, updateDoc, collection, onSnapshot, setDoc, addDoc } from "firebase/firestore"
import { toast, ToastContainer } from 'react-toastify'

function Withdraw() {
  const navigate = useNavigate()
  const [wAmt, setWamt] = useState()
  const [payAmt, setPayAmt] = useState('')
  const [upiId, setUpiId] = useState('')
  const [ActiveWithBtn, setActiveWithBtn] = useState(false)



  console.log(wAmt)
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/Login')
      }
      try {
        const docRef = doc(db, "users", user.uid); // "users" is collection
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWamt(docSnap.data().WAmt)
        } else {
          toast.info("No user data found!");
        }
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };
    fetchUserData();

  }, []);



  const WithdrawBtn = async () => {
    if (ActiveWithBtn) return
    if (!payAmt.trim() || !upiId.trim()) {
      toast.info("Field is empty")
      return
    }
    const user = auth.currentUser
    if (payAmt <= 0) {
      toast.info("Enter a valid amount");
    } else if (payAmt <= wAmt) {
      const amtLeft = wAmt - payAmt;

      await addDoc(collection(db, "withdraw"), {
        PayAmt: payAmt,
        UPI: upiId,
        createdAt: new Date()
      });

      await updateDoc(doc(db, "users", user.uid), {
        WAmt: amtLeft
      });
      setActiveWithBtn(true)
      toast.info("Withdrawal request has been submitted");
    } else {
      toast.info("You don't have enough money");
    }
  }

  return (
    <>
      <div className='mainui'>
        <Header />
        <div className='withdrawform'>
          <h1>WITHDRAW MONEY</h1>
          <input type='number'
            value={payAmt}
            placeholder='Enter Amount'
            onChange={((e) => setPayAmt(e.target.value))}
          />
          <input type='text'
            value={upiId}
            placeholder='Enter UPI ID Or Phone*'
            onChange={((e) => setUpiId(e.target.value))}
          />
          <p><b>Note: - </b>Min - &#8377;2 and Max - &#8377;50,000 & if you enter phone number, make sure you enter the UPI number.</p>
          <button onClick={WithdrawBtn} className={ActiveWithBtn ? "Wbtn active" : "Wbtn"}>WITHDRAW</button>

        </div>
      </div>
      <ToastContainer
        position='bottom-center'
        autoClose={2000}
        closeOnClick={false}
        theme="light"
        limit={1}
      />
      <BottomMenu />
    </>
  )
}

export default Withdraw