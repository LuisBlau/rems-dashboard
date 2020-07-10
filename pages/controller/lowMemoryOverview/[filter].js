import ConnectionOverview from "../lowMemoryOverview";
import { useRouter} from "next/router";
import React from "react";
import LowMemoryPaper from "../../../components/Memory/LowMemoryPaper";

export default function filterHelperMemory({params}) {
  const router = useRouter()
  const {filter} =  router.query
  return <ConnectionOverview filter={filter}/>
}
