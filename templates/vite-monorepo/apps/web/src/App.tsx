import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

export function App() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project ready</CardTitle>
          <CardDescription>
            Token baseline and starter components are wired in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="name@example.com" />
        </CardContent>
        <CardFooter>
          <Button className="w-full">Continue</Button>
          <Button variant="outline" className="w-full">
            Docs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
