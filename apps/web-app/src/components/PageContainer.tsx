"use client"

import { useLogContext } from "@/context/LogContext"
import shortenString from "@/utils/shortenString"
import { Container, HStack, Icon, IconButton, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import { usePathname } from "next/navigation"
import { FaGithub } from "react-icons/fa"
import NextLink from "next/link"

export default function PageContainer({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
    const { log } = useLogContext()

    function getExplorerLink(network: string, address: string) {
        switch (network) {
            case "sepolia":
                return `https://sepolia.etherscan.io/address/${address}`
            case "arbitrum-sepolia":
                return `https://sepolia.arbiscan.io/address/${address}`
            case "optimism-sepolia":
                return `https://sepolia-optimism.etherscan.io/address/${address}`
            case "polygon-amoy":
                return `https://amoy.polygonscan.com/address/${address}`
            case "arbitrum":
                return `https://arbiscan.io/address/${address}`
            case "polygon":
                return `https://polygonscan.com/address/${address}`
            case "optimism":
                return `https://optimistic.etherscan.io/address/${address}`
            case "base-sepolia":
                return `https://sepolia.basescan.org/address/${address}`
            case "linea-sepolia":
                return `https://sepolia.lineascan.build/address/${address}`
            case "base":
                return `https://basescan.org/address/${address}`
            case "linea":
                return `https://lineascan.build/address/${address}`
            case "scroll-sepolia":
                return `https://sepolia.scrollscan.com/address/${address}`
            default:
                return ""
        }
    }

    return (
        <>
            <HStack align="center" justify="space-between" p="2">
                <HStack ml="4">
                    <NextLink href="/">Feedback</NextLink>
                </HStack>
                <HStack>
                    <Link
                        href={getExplorerLink(
                            process.env.NEXT_PUBLIC_DEFAULT_NETWORK as string,
                            process.env.NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS as string
                        )}
                        isExternal
                    >
                        <Text>
                            {shortenString(process.env.NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS as string, [6, 4])}
                        </Text>
                    </Link>
                    <Link href="https://github.com/semaphore-protocol/boilerplate" isExternal>
                        <IconButton
                            aria-label="Github repository"
                            variant="link"
                            py="3"
                            color="text.100"
                            icon={<Icon boxSize={6} as={FaGithub} />}
                        />
                    </Link>
                </HStack>
            </HStack>

            <Container maxW="xl" flex="1" display="flex" alignItems="center">
                <Stack pt="8" pb="24" display="flex" width="100%">
                    {children}
                </Stack>
            </Container>

            <HStack
                flexBasis="56px"
                borderTopWidth="1px"
                borderTopColor="text.600"
                backgroundColor="darkBlueBg"
                align="center"
                justify="center"
                spacing="4"
                p="4"
            >
                {log.endsWith("...") && <Spinner color="primary.400" />}
                <Text>{log || `Current step: ${pathname}`}</Text>
            </HStack>
        </>
    )
}
