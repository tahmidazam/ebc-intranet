import { CollectionBadge } from "@/components/collection-tags";
import { EditCollectionAccessDialog } from "@/components/edit-collection-access-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member } from "@/schemas/member";

export function MembersTable({
  members,
  refetch,
}: {
  members: Member[];
  refetch: () => void;
}) {
  return (
    <section className="flex grow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>name</TableHead>
            <TableHead>email</TableHead>
            <TableHead>collections</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <EditCollectionAccessDialog
              key={member.id}
              member={member}
              onSave={refetch}
            >
              <TableRow key={member.id}>
                <TableCell>{member.fullName}</TableCell>
                <TableCell>{member.emailAddress}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {member.collectionIds.map((collectionId) => {
                      return (
                        <CollectionBadge
                          key={collectionId}
                          collectionId={collectionId}
                        />
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            </EditCollectionAccessDialog>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
