import {
  Search,
  UploadCloud,
  ChevronDown,
} from "lucide-react";
const ToolbarLearning = ({onChangeFilter, onChangeUpload, onChangeSearch, filter, search}) => {
  return (
    <div>
        <div className="mb-8 flex flex-col gap-5 md:flex-row">
            {/* MOBILE + DESKTOP TOP */}
            <div className="flex w-full gap-3">
              {/* UPLOAD */}
              <label
                className="
                  group cursor-pointer
                  flex flex-1 items-center justify-center gap-2
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-5 py-3
                  text-sm font-semibold text-white
                  shadow-lg shadow-blue-500/20
                  transition-all duration-300

                  hover:scale-[1.02]
                  hover:shadow-blue-500/40

                  sm:flex-none
                "
              >
                <UploadCloud className="h-5 w-5 transition group-hover:-translate-y-0.5" />

                <span className="hidden sm:block">Upload Document</span>

                <span className="sm:hidden">Upload</span>

                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={onChangeUpload}
                  className="hidden"
                />
              </label>

              {/* FILTER */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={filter}
                  onChange={onChangeFilter}
                  className="
                    appearance-none
                    w-full
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-3 pr-11
                    text-sm text-white
                    outline-none
                    backdrop-blur-xl
                    cursor-pointer
                  "
                >
                  <option value="new-upload" className="bg-[#050816]">
                    New Upload
                  </option>

                  <option value="latest-upload" className="bg-[#050816]">
                    Latest Upload
                  </option>

                  <option value="favorite" className="bg-[#050816]">
                    Favorite
                  </option>
                </select>

                <ChevronDown
                  className="
                    pointer-events-none
                    absolute right-4 top-1/2
                    h-4 w-4 -translate-y-1/2
                    text-slate-400
                  "
                />
              </div>
            </div>

            {/* SEARCH */}
            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-white/10
                bg-white/5 px-4 py-3
                backdrop-blur-xl
                w-full lg:max-w-md lg:self-end
              "
            >
              <Search className="h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={onChangeSearch}
                className="
                  w-full bg-transparent
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-500
                "
              />
            </div>
          </div>
    </div>
  )
}

export default ToolbarLearning