import GlobalSearch from "@/components/others/GlobalSearch";
import Conversation from "@/components/whatsapp/Conversation";
import Messages from "@/components/whatsapp/Messages";

const Whatsapp = () => {
  return (
    <>
      <div className="bg-gray-100 h-[700px]">
        <GlobalSearch />

        <div className="mt-2">
          <div className="flex h-[600px] bg-gray-100">
            <div className="w-80 h-[80%] bg-gray-100 p-2 hidden md:block">
              <div className="h-[600px] overflow-y-auto">
                <div className="sticky top-0 bg-gray-100 z-10">
                  <div className="text-xl font-extrabold text-gray-700 p-3">
                    Chikaa
                  </div>
                  <div className="search-chat flex p-3">
                    <input
                      className="input text-gray-700 text-sm p-3 focus:outline-none bg-white w-full rounded-l-md"
                      type="text"
                      placeholder="Search Messages"
                    />
                    <div className="bg-white flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-600 p-3">
                  Recent
                </div>
                <Conversation />
              </div>
            </div>
            <div className="flex-grow h-[600px] p-2 rounded-md">
              <Messages />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Whatsapp;
