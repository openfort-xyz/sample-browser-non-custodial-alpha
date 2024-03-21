import Header from "./header";
import Footer from "./footer";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-col flex-grow container mx-auto md:w-11/12 lg:w-4/5 xl:w-3/4 divide-y divide-black-500">
        <main className="flex-grow">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
