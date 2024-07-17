import { CustomLogo } from "../Shared/CustomLogo";

export default function Header(props: any) {
  return (
    <div className="bg-gray-200 flex w-full sm:text-center text-left items-center p-4">
      <CustomLogo />
      <div className="text-zinc-700 w-full sm:justify-center justify-start">
        SELF-CUSTODIAL SMART ACCOUNT
        <a
          href="https://github.com/openfort-xyz/sample-browser-nextjs-embedded-signer"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          (View Source)
        </a>
      </div>
    </div>
  );
}
