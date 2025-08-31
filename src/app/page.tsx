import Image from "next/image";
import styles from "./page.module.css";
import Header from "../templates/header";
import Categorization from "../templates/categorization";

export default function Home() {
  return (
    <>
      <Header />
      <Categorization />
    </>
  );
}
