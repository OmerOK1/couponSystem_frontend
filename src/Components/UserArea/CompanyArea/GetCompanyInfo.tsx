import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {  getCompanyInfoApi } from "../../../WebApi/CompanyApi";
import { ClientType } from "../../../Models/ClientType";
import { CompanyModel } from "../../../Models/CompanyModel";
import store from "../../../Redux/Store";
import notify, { ErrMsg, SccMsg } from "../../../Services/Notification";
import { addCompanyAction } from "../../../Redux/CompanyState";
import CompanyInfoCard from "../../SharedArea/Cards/CompanyInfoCard/CompanyInfoCard";

export default function GetCompany() {
  const requiredType = ClientType.COMPANY; 
  const navigate = useNavigate();
  const companyId = JSON.parse(localStorage.getItem('user')).id;
  
  const [company, setCompany] = useState<CompanyModel>(
    store
      .getState()
      .companyReducer.companies.find((company) => company.id === companyId)
  );

  const getCompanyFromServer = async () => {
    await getCompanyInfoApi()
    .then((res) => {
        notify.success(SccMsg.COMPANY_FETCH_ONE_SUCCESS);
        store.dispatch(addCompanyAction(res.data));
        setCompany(res.data);
      })

      .catch((error) => {
        notify.error(error);
        navigate("/home");
      });
  };
  (function () {
    if (company === undefined) {
      getCompanyFromServer();
    }
  })();

  useEffect(() => {
    console.log(companyId);
    if (!store.getState().authReducer.user.token) {
      notify.error(ErrMsg.NO_TOKEN);
      navigate("/login");
    }
    if (!(store.getState().authReducer.user.clientType === requiredType)) {
      notify.error(ErrMsg.UNAUTHORIZED_ACTION);
      navigate("/login");
    }
    
  }, []);
  

  return (
    <>
      {
        company ? 
        <CompanyInfoCard company={company} isSelf={true} to={"/companies/view/" + companyId} />
         : 
         <span>oops, there's a problem getting your information</span>
      }
      
    </>
  );
}

//export default GetCompany;
