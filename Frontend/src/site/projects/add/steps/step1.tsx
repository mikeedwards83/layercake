import { Form, Row, Col } from 'react-bootstrap'
import { IconSelector } from '@/components/Form/IconSelectorInput'
import { ColorPicker } from '@/components/Form/ColorPickerInput'
import { UserSelectorInput } from '@/components/Form/UserSelectorInput'
import type { User } from '@/types/user'
import { fakeUsers } from '@/components/Form/UserSelectorInput/data'
import { FormDivider } from '@/components/Form/FormDivider'
import { TextInput } from '@/components/Form/TextInput'
import { TextAreaInput } from '@/components/Form/TextAreaInput'
import type { ProjectsPostRequest } from '@/services/projects/projectsApiClient'

interface ProjectAddStep1Props {
  projectData: ProjectsPostRequest
  errors: Partial<Record<keyof ProjectsPostRequest, string>>
  updateProjectData: (field: keyof ProjectsPostRequest, value: string | undefined) => void
}

export const ProjectAddStep1 = ({ projectData, errors, updateProjectData }: ProjectAddStep1Props) => {
  return (
    <div>
      <Form>
        <Row className="g-3">
          <Col md={12}>
            <TextInput
              label="Name"
              placeholder="Enter project name"
              maxChars={50}
              onChange={(value) => updateProjectData('name', value)}
              error={errors.name}
              value={projectData.name}
              required
            />
          </Col>
          <Col md={12}>
            <TextInput
              label="Key"
              placeholder="Enter project key (max 10 characters, automatically capitalized)"
              maxChars={10}
              onChange={(value) => {
                const upperValue = value?.toUpperCase().replace(/[^A-Z0-9]/g, '')
                updateProjectData('key', upperValue)
              }}
              error={errors.key}
              hint="Letters and numbers only (automatically capitalized)"
              value={projectData.key}
              required
            />
          </Col>
          <Col md={12}>
            <TextAreaInput
              label="Description"
              placeholder="Enter project description"
              maxChars={300}
              onChange={(value) => updateProjectData('description', value)}
              error={errors.description}
              value={projectData.description}
              required
            />
          </Col>
          <FormDivider />
          <Col md={12}>
            <UserSelectorInput
              label="Project Owner"
              onChange={function (user?: User): void {
                updateProjectData('ownerId', user?.id)
              }}
              users={fakeUsers}
              value={projectData.ownerId}
              error={errors.ownerId}
            />
          </Col>
          <FormDivider />
          <Col md={12}>
            <IconSelector label='Icon' value={projectData.icon} onChange={(icon) => updateProjectData('icon', icon)} color={projectData.color}  />
          </Col>
          <Col md={12}>
            <ColorPicker label="Colour" value={projectData.color} onChange={(color) => updateProjectData('color', color)} />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
