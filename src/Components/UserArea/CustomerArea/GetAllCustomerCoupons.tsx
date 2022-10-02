import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm} from 'react-hook-form';
import * as yup from "yup";
import { ClientType } from '../../../Models/ClientType';
import { CouponModel } from '../../../Models/CouponModel';
import store from '../../../Redux/Store';
import notify, { ErrMsg, SccMsg } from '../../../Services/Notification';
import CustomLink from '../../SharedArea/CustomLink/CustomLink';
import { BsPencilSquare } from 'react-icons/bs';
import EmptyView from '../../SharedArea/EmptyView/EmptyView';
import CouponCard from '../../SharedArea/Cards/CouponCard/CouponCard';
import { Category } from '../../../Models/Category';
import { getAllCouponsApi, getAllCustomerCouponsApi } from '../../../WebApi/CustomerApi';
import { getCouponsAction, getCustomerCouponsAction } from '../../../Redux/CustomerState';

function GetAllCustomerCoupons() {
    const requiredType = ClientType.CUSTOMER;
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState<CouponModel[]>(store.getState().customerReducer.customerCoupons);
    const [category, setCategory] = useState<String>("ALL");
    const [maxPrice, setMaxPrice] = useState<number>(0);


    useEffect(()=>{
        if (!store.getState().authReducer.user.token){
            notify.error(ErrMsg.NO_TOKEN);
            navigate("/login");
        }
        if (!(store.getState().authReducer.user.clientType === requiredType)){
            notify.error(ErrMsg.UNAUTHORIZED_ACTION);
            navigate("/login");
        }
    },[]) 

    useEffect(() => {
        if (coupons.length <= 0) {
            getAllCustomerCoupons();
        }
    },[])
    
    const getAllCustomerCoupons = async ()=> {
        await getAllCustomerCouponsApi().then((res)=>{
            notify.success(SccMsg.COUPONS_FETCH_SUCCESS);
            store.dispatch(getCustomerCouponsAction(res.data));
            setCoupons(res.data);
        })
        .catch ((error)=>{
            notify.error(error);
        })
    }

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.currentTarget.value);
        let filteredCoupons = store.getState().customerReducer.customerCoupons;
        if (maxPrice !== 0) {
            filteredCoupons = 
            filteredCoupons.filter(
                (coupon) => { 
                    return coupon.price <= maxPrice; 
                });}
        if (e.currentTarget.value !== "ALL") {
            filteredCoupons =
                filteredCoupons.filter(
                    (coupon) => { 
                        return coupon.category.valueOf() === e.currentTarget.value;
                     });
        } 
        setCoupons(filteredCoupons);
    }

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(Number(e.currentTarget.value));
        let filteredCoupons = store.getState().customerReducer.customerCoupons;
        console.log(category);
        if (category !== "ALL") {
        filteredCoupons= 
            filteredCoupons.filter(
                (coupon) => { 
                    return coupon.category.valueOf() === category 
                });
            }
        if (Number(e.currentTarget.value) !== 0) {
            filteredCoupons =
                filteredCoupons.filter(
                    (coupon) => { 
                        return coupon.price <= Number(e.currentTarget.value)
                    });
        } 
        setCoupons(filteredCoupons);
    }
    

    return (
        <div className="coupons_view_container">
            <h1>My Coupons</h1>
            <label htmlFor="category"></label>
                <select name='category' placeholder="category" onChange={(e)=>handleCategoryChange(e)} defaultValue="ALL" id="category"> 
                <option key="ALL" value="ALL">All</option>
                {Object.keys(Category).map((key, index) => (
                <option
                aria-selected="true"
                key={key}
                value={key}
                >{Object.values(Category)[index]}
                </option>
                ))}
                </select>
                <label htmlFor="price">Coupon Price</label>
                <input type="number" min={0} max={999_999} step={1} defaultValue={0} onChange={(e)=>handleMaxPriceChange(e)} id="price" name='price'/>
            <div className="coupon_list_container">
                {
                    coupons.length > 0 ?
                    (<div className="coupons_gallery">
                        {coupons.map((coupon, index)=>(
                         <CouponCard key={index} purchasable={true} owned={true} coupon={coupon} to={"/coupons"}/>
                        ))}
                    </div>) : 
                    (<div className="empty_view">
                        <EmptyView msg="no coupons available"/>
                    </div>)
                }
            </div>
        </div>
    )}

export default GetAllCustomerCoupons;

