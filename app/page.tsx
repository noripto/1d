import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card>
        <CardHeader>
          <CardTitle>
            <p>Hello World</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>aaaaaaaa</p>
        </CardContent>
      </Card>
    </div>
  );
}
