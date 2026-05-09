import { UploadCloud } from "lucide-react";
const EmptyDocumentLearning = ({ onChangeUpload }) => {
  return (
    <div
      className="
                flex flex-col items-center justify-center
                rounded-4xl
                border border-dashed border-white/10
                bg-white/3
                px-6 py-20
                text-center
                backdrop-blur-xl
              "
    >
      <div
        className="
                  mb-6 flex h-20 w-20 items-center justify-center
                  rounded-full
                  bg-linear-to-br from-blue-500/20 to-violet-500/20
                "
      >
        <UploadCloud className="h-10 w-10 text-blue-400" />
      </div>

      <h2 className="text-2xl font-bold tracking-[-0.5px]">
        Belum Ada Dokumen
      </h2>

      <p className="mt-3 max-w-md text-sm text-slate-400">
        Upload materi pembelajaran untuk mulai belajar bersama AI.
      </p>

      <label
        className="
                  mt-8 cursor-pointer
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-6 py-3
                  text-sm font-semibold text-white
                  transition-all duration-300
                  hover:scale-[1.02]
                "
      >
        Upload First Document
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={onChangeUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default EmptyDocumentLearning;
