import { UserReview } from "@/components/Review/UserReview";
import type { User } from "@/types/user";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

interface TeamSelectorProps {
  value?: string
  label:string
  onChange: (user?: User) => void,
  users: User[]
  error?:string
}

export const UserSelectorInput = ({ value, onChange, error, users }: TeamSelectorProps) => {

    const [selectedUser, setSelectedUser] = useState<User|undefined>(undefined);

    const handleOnChange = (selectedValue:string) =>{
        const matchingUsers = users.filter(user=> user.id == selectedValue);
        
        if(matchingUsers.length === 0){
            onChange(undefined);
            setSelectedUser(undefined);
        }
        else{
            onChange(matchingUsers[0]);
            setSelectedUser(matchingUsers[0]);
        }
    }

  return (
    <div>
        <Row className="g-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>
                Project Owner <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={value}
                onChange={(e) => handleOnChange(e.target.value)}
                isInvalid={!!error}
              >
                <option value="">Select a project owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Select the person who will be responsible for this project
              </Form.Text>
            </Form.Group>
          </Col>

          {selectedUser && (
            <Col md={12}>
              <UserReview users={users} value={selectedUser.id}  />
            </Col>
          )}
        </Row>
    </div>
  );
};
