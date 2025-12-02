import { BreadcrumbItem } from 'react-bootstrap'
import { TbChevronRight } from 'react-icons/tb'
import PageMetaData from '../PageMetaData'

type PageBreadcrumbProps = {
  title: string
  subtitle?: string | string[]
  icon?: string
}

const PageBreadcrumb = ({ title, subtitle, icon }: PageBreadcrumbProps) => {

  const subtitles = subtitle ? (Array.isArray(subtitle) ? subtitle: [subtitle]) : undefined;

  return (
    <>
      <PageMetaData title={title} />
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">{icon && BreadcrumbIcon(icon)} {title}</h4>
        </div>
        <div className="text-end">
          <div className="breadcrumb m-0 py-0 d-flex align-items-center gap-1">
            <BreadcrumbItem>Blackbird Dev</BreadcrumbItem> <TbChevronRight />
            {subtitles && subtitles.map( subtitle =>
              <>
                <BreadcrumbItem>{subtitle}</BreadcrumbItem> <TbChevronRight />
              </>
            )}
            <BreadcrumbItem active>{title}</BreadcrumbItem>
          </div>
        </div>
      </div>
    </>
  )
}

const BreadcrumbIcon = (icon: string) => (
  <span className="avatar-sm text-bg-light rounded pe-1">
    <img src={icon} height="14" alt="Project-icon" />
  </span>
)

export default PageBreadcrumb
