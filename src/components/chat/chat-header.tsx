"use client";

import { GithubIcon, PlusIcon } from "@/components/icons";
import { SidebarToggle } from "@/components/sidebar-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";

export function ChatHeader() {
  const navigate = useNavigate();
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const { width: windowWidth } = useWindowSize();

  return (
    <>
      <header className="sticky top-0 flex items-center justify-between gap-2 bg-background px-2 py-1.5 md:px-2">
        <SidebarToggle />
        {(windowWidth < 768) && (
          <Button
            className="order-2 h-8 px-2  md:h-fit md:px-2"
            onClick={() => {
              navigate("/");
            }}
            variant="outline"
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        )}
        <div className="hidden md:flex items-center gap-1">
          <h3 className="text-lg font-bold">Newsly</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowInfoDialog(true)}
          >
            <Info size={16} />
            <span className="sr-only">About Newsly</span>
          </Button>
        </div>
        <Link target="_blank" to="https://github.com/vamsi4845/voosh-frontend" className=" hidden md:block">
            <Button variant="secondary" className="h-8 px-2 py-1">
                <span className="mr-2">Open Source</span>
                <GithubIcon className="w-4 h-4" />
            </Button>
        </Link>
      </header>

      <AlertDialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>About Newsly</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-3">
              <p>
                Newsly is a RAG-powered chatbot designed specifically for news websites. 
                It helps you find and understand information from news articles quickly and accurately.
              </p>
              <div className="space-y-2">
                <p className="font-medium">Key Features:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ask questions about news articles and get instant answers</li>
                  <li>Retrieval-Augmented Generation (RAG) for accurate, source-backed responses</li>
                  <li>View sources for every answer to verify information</li>
                  <li>Chat history to continue conversations</li>
                </ul>
              </div>
              <p className="text-sm pt-2">
                Simply type your question and Newsly will search through news articles 
                to provide you with relevant, up-to-date information.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction onClick={() => setShowInfoDialog(false)}>
              Got it
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
