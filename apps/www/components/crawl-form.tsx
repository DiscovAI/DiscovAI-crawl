import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FiLink,
  FiClock,
  FiCamera,
  FiCpu,
  FiDatabase,
  FiLoader,
} from "react-icons/fi";

const ScrapeSchema = z.object({
  url: z.string().url("Invalid URL"),
  wait_after_load: z.number().optional(),
  timeout: z.number().optional(),
  // headers: z.record(z.string()).optional(),
  check_selector: z.string().optional(),
  need_screenshot: z.boolean().optional(),
  need_embedding: z.boolean().optional(),
  llm_extract: z.boolean().optional(),
  llm_detail: z.boolean().optional(),
});

export type ScrapeModel = z.infer<typeof ScrapeSchema>;

interface ScrapeFormProps {
  onSubmit: (data: ScrapeModel) => void;
  isLoading: boolean;
  defaultValues: ScrapeModel;
}

export default function ScrapeForm({
  onSubmit,
  isLoading,
  defaultValues,
}: ScrapeFormProps) {
  const form = useForm<ScrapeModel>({
    resolver: zodResolver(ScrapeSchema),
    defaultValues,
  });

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Web Scraping API Playground</CardTitle>
        <CardDescription>
          Configure your web scraping parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FiLink className="inline mr-2" />
                    URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="wait_after_load"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      <FiClock className="inline mr-2" />
                      Wait After Load (ms)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      <FiClock className="inline mr-2" />
                      Timeout (ms)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="need_screenshot"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <FiCamera className="inline mr-2" />
                        Need Screenshot
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="llm_extract"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <FiCpu className="inline mr-2" />
                        LLM Extract
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="need_embedding"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <FiDatabase className="inline mr-2" />
                        Need Embedding
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <FiLoader className="mr-2" /> : null}
          {isLoading ? "Scraping..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
