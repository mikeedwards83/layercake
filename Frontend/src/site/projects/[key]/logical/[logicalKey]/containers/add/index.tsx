import { useParams, useNavigate } from 'react-router'
import { lazy, Suspense } from 'react'
import PageMetaData from '@/components/PageMetaData'

const AddContainerWorkflow = lazy(() => import('./containerAddWorkflow'))

const ContainerAdd = () => {
  const { key: projectKey, logicalKey } = useParams<{ key: string; logicalKey: string }>()
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate(`/projects/${projectKey}/logical/${logicalKey}`)
  }

  if (!projectKey || !logicalKey) {
    return <div>Invalid route parameters</div>
  }

  return (
    <>
      <PageMetaData title="Add Container" />
      <div className="container-fluid">
        <Suspense fallback={<div>Loading...</div>}>
          <AddContainerWorkflow projectKey={projectKey} logicalKey={logicalKey} onCancel={handleCancel} />
        </Suspense>
      </div>
    </>
  )
}

export default ContainerAdd
