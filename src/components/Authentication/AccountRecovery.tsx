import { useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useOpenfort } from "../../hooks/useOpenfort";
import Spinner from "../Shared/Spinner";

const AccountRecovery: React.FC = () => {
  const { idToken } = useAuthentication();
  const { handleRecovery } = useOpenfort();
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [loadingAut, setLoadingAut] = useState(false);

  if (!idToken) return null;

  return (
    <>
      <h2 className="text-left mb-2 font-semibold text-lg">
        {"Enter your recovery pin"}
      </h2>
      <div className="mb-5">
        <div className="mb-5 mt-10">
          <input
            type="number"
            name="passwordRecovery"
            placeholder="Pin recovery"
            className="w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div className="mb-5 flex justify-center items-center">
          <div>
            <div className="flex justify-center items-center">
              <button
                disabled={loadingPwd}
                className="bg-black text-white p-2.5 rounded-lg w-full"
                onClick={async () => {
                  const password = (
                    document.querySelector(
                      'input[name="passwordRecovery"]'
                    ) as HTMLInputElement
                  ).value;
                  setLoadingPwd(true);
                  await handleRecovery("password", idToken, password);
                  setLoadingPwd(false);
                }}
              >
                {loadingPwd ? <Spinner /> : "Submit"}
              </button>
            </div>
            <div className="flex justify-center items-center mt-2">
              <button
                disabled={loadingAut}
                className="bg-white text-black p-2.5 border border-gray-200 rounded-lg w-72 hover:bg-gray-100"
                onClick={async () => {
                  setLoadingAut(true);
                  await handleRecovery("automatic", idToken);
                  setLoadingAut(false);
                }}
              >
                {loadingAut ? <Spinner /> : "Continue with Automatic Recovery"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountRecovery;
