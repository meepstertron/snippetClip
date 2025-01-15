"use client"

import { useState } from "react"
import ReactCodeMirror from "@uiw/react-codemirror"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import config from "./config"
import TagSelector from "./components/tagSelector"

function CreateSnippet() {
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !code) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "default",
      })
      return
    }
    
    fetch(`${config.apiUrl}/api/snippets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        language,
        code,
        tags,
      })
    });

    console.log({ title, language, code, tags })
    toast({
      title: "Success",
      description: "Snippet created successfully!",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Snippet</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter snippet title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="c++">C++</SelectItem>
                    <SelectItem value="c#">C#</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="scala">Scala</SelectItem>
                    <SelectItem value="r">R</SelectItem>
                    <SelectItem value="shell">Shell</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="perl">Perl</SelectItem>
                    <SelectItem value="lua">Lua</SelectItem>
                    <SelectItem value="assembly">Assembly</SelectItem>
                    <SelectItem value="dart">Dart</SelectItem>
                    <SelectItem value="elixir">Elixir</SelectItem>
                    <SelectItem value="haskell">Haskell</SelectItem>
                    <SelectItem value="lisp">Lisp</SelectItem>
                    <SelectItem value="matlab">Matlab</SelectItem>
                    <SelectItem value="objectivec">Objective-C</SelectItem>
                    <SelectItem value="prolog">Prolog</SelectItem>
                    <SelectItem value="racket">Racket</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <TagSelector 
                tags={tags}
                setTags={setTags}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <ReactCodeMirror
                id="code"
                value={code}
                height="400px"
                
                onChange={(value) => setCode(value)}
                theme="dark"
                className="border rounded-md"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create Snippet</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default CreateSnippet

