import { Footer } from "flowbite-react";

export default function FooterCom() {
  return (
    <Footer container className="mt-auto">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
        </div>
        <Footer.Divider />
        <Footer.Copyright href="/" by="STUPER™" year={2025} />
      </div>
    </Footer>
  );
}
