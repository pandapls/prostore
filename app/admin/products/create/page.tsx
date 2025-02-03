import ProductForm from "@/components/admin/productForm";
import { PRODUCT_FORM_TYPE } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Create Product'
}
const CreateProductPage = () => {
    return (<>
        <h2 className="h2-bold">Create Product</h2>
        <div className="my-8">
            <ProductForm type={PRODUCT_FORM_TYPE.create} />
        </div>
    </>);
}

export default CreateProductPage;